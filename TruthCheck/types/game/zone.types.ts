import Resource from './resource.types.ts';
import Timeline from '../util/timeline.types.ts';

interface Zone extends Resource {
  events: Timeline;
}

export default Zone;
