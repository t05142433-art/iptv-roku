import axios from 'axios';

export interface XtreamConfig {
  host: string;
  user: string;
  pass: string;
}

export interface Category {
  category_id: string;
  category_name: string;
  parent_id: number;
}

export interface Stream {
  num: number;
  name: string;
  stream_type: string;
  stream_id: number;
  stream_icon: string;
  epg_channel_id: string;
  added: string;
  category_id: string;
  custom_sid: string;
  tv_archive: number;
  direct_source: string;
  tv_archive_duration: number;
  thumbnail?: string;
  rating?: string;
  plot?: string;
  cast?: string;
  year?: string;
  duration?: string;
}

export interface Series {
  num: number;
  name: string;
  series_id: number;
  cover: string;
  plot: string;
  cast: string;
  director: string;
  genre: string;
  releaseDate: string;
  last_modified: string;
  rating: string;
  category_id: string;
}

export class IPTVService {
  private config: XtreamConfig | null = null;

  setConfig(config: XtreamConfig) {
    this.config = config;
  }

  private get baseUrl() {
    if (!this.config) throw new Error('Config not set');
    return this.config.host.endsWith('/') ? this.config.host : `${this.config.host}/`;
  }

  async authenticate() {
    if (!this.config) return null;
    const url = `${this.baseUrl}player_api.php?username=${this.config.user}&password=${this.config.pass}`;
    const response = await axios.get(url);
    return response.data;
  }

  async getCategories(action: 'get_live_categories' | 'get_vod_categories' | 'get_series_categories') {
    const url = `${this.baseUrl}player_api.php?username=${this.config?.user}&password=${this.config?.pass}&action=${action}`;
    const response = await axios.get(url);
    return response.data as Category[];
  }

  async getStreams(action: 'get_live_streams' | 'get_vod_streams' | 'get_series', categoryId?: string) {
    let url = `${this.baseUrl}player_api.php?username=${this.config?.user}&password=${this.config?.pass}&action=${action}`;
    if (categoryId) {
      url += `&category_id=${categoryId}`;
    }
    const response = await axios.get(url);
    return response.data;
  }

  async getSeriesInfo(seriesId: number) {
    const url = `${this.baseUrl}player_api.php?username=${this.config?.user}&password=${this.config?.pass}&action=get_series_info&series_id=${seriesId}`;
    const response = await axios.get(url);
    return response.data;
  }

  async getVodInfo(vodId: number) {
    const url = `${this.baseUrl}player_api.php?username=${this.config?.user}&password=${this.config?.pass}&action=get_vod_info&vod_id=${vodId}`;
    const response = await axios.get(url);
    return response.data;
  }

  getStreamUrl(type: 'live' | 'movie' | 'series', streamId: number | string, extension: string = 'ts') {
    if (!this.config) return '';
    if (type === 'live') {
      return `${this.baseUrl}live/${this.config.user}/${this.config.pass}/${streamId}.${extension}`;
    } else if (type === 'movie') {
      return `${this.baseUrl}movie/${this.config.user}/${this.config.pass}/${streamId}.${extension}`;
    } else {
      return `${this.baseUrl}series/${this.config.user}/${this.config.pass}/${streamId}.${extension}`;
    }
  }
}

export const iptvService = new IPTVService();
