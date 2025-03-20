import Database from 'better-sqlite3';
import { writeFileSync, mkdirSync } from 'fs';

const db = new Database('./data.db', { readonly: true });

const songs = db.prepare('SELECT * FROM songs').all();
const tagsArray = db.prepare('SELECT * FROM tags').all();
const songTagsArray = db.prepare('SELECT * FROM song_tags').all();

mkdirSync('./timestamps', { recursive: true });

writeFileSync('./songs.json', JSON.stringify(songs, null, 2));

const tags = Object.fromEntries(
  (tagsArray as { tag_id: string; tag_name: string }[]).map(({ tag_id, tag_name }) => [tag_id, tag_name])
);
writeFileSync('./tags.json', JSON.stringify(tags, null, 2));

const songTags = (songs as { song_id: string }[]).map((song) => ({
  song_id: song.song_id,
  tags: (songTagsArray as { song_id: string; tag_id: string }[])
    .filter((st) => st.song_id === song.song_id)
    .map((st) => st.tag_id),
}));

writeFileSync('./song_tags.json', JSON.stringify(songTags, null, 2));

const videos = db.prepare('SELECT DISTINCT video_id FROM timestamps').all();

mkdirSync('./timestamps', { recursive: true });

(videos as { video_id: string }[]).forEach(({ video_id }) => {
  const timestamps = db
    .prepare('SELECT track_number, song_id, start, end FROM timestamps WHERE video_id = ? ORDER BY track_number')
    .all(video_id);

  const content = { videoId: video_id, timestamps };
  writeFileSync(`./timestamps/${video_id}.json`, JSON.stringify(content, null, 2));

});

console.log('✅ JSONへのエクスポートが完了しました。');
