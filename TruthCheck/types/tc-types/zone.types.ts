import Resource from './resource.types.ts';
import Timeline from '../util/timeline.types.ts';

interface Zone extends Resource {
  description: string;
  events: Timeline;
}

export default Zone;
