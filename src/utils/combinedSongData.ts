// src/utils/combinedSongData.ts
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

export interface Tag {
  tagId: string;
  tagName: string;
}

export interface Song {
  songId: string;
  title: string;
  artist: string;
}

export interface SongTag {
  songId: string;
  tagId: string;
}

export interface Timestamp {
  trackNumber: number;
  songId: string;
  start: string;
  end: string;
}

export interface TimestampsFile {
  videoId: string;
  timestamps: Timestamp[];
}

export interface CombinedTrack {
  videoId: string;
  trackNumber: number;
  title: string;
  artist: string;
  tags: string[];
  start: string;
  end: string;
}

function loadYaml<T>(filePath: string): T {
  const fileContents = fs.readFileSync(filePath, 'utf-8');
  return yaml.load(fileContents) as T;
}

const tagsPath = path.join(process.cwd(), 'src', 'data', 'tags.yaml');
const songsPath = path.join(process.cwd(), 'src', 'data', 'songs.yaml');
const songTagsPath = path.join(process.cwd(), 'src', 'data', 'song_tags.yaml');
const timestampsPath = path.join(process.cwd(), 'src', 'data', 'timestamps', 'w2OPaFBFBdQ.yaml');

const tags: Tag[] = loadYaml<Tag[]>(tagsPath);
const songs: Song[] = loadYaml<Song[]>(songsPath);
const songTags: SongTag[] = loadYaml<SongTag[]>(songTagsPath);
const timestampsFile: TimestampsFile = loadYaml<TimestampsFile>(timestampsPath);

const songMap = new Map<string, Song>();
songs.forEach(song => {
  songMap.set(song.songId, song);
});

const tagMap = new Map<string, string>();
tags.forEach(tag => {
  tagMap.set(tag.tagId, tag.tagName);
});

const songTagsMap = new Map<string, string[]>();
songTags.forEach(st => {
  const tagName = tagMap.get(st.tagId);
  if (!tagName) return;
  if (!songTagsMap.has(st.songId)) {
    songTagsMap.set(st.songId, []);
  }
  songTagsMap.get(st.songId)?.push(tagName);
});

const combinedTracks: CombinedTrack[] = timestampsFile.timestamps.map(ts => {
  const song = songMap.get(ts.songId);
  return {
    videoId: timestampsFile.videoId,
    trackNumber: ts.trackNumber,
    title: song ? song.title : '',
    artist: song ? song.artist : '',
    tags: songTagsMap.get(ts.songId) || [],
    start: ts.start,
    end: ts.end,
  };
});

export default combinedTracks;
