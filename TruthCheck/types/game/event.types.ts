import Resource from "./resource.types.ts";
import Interaction from "./interaction.types.ts";
import Relation from "./relation.types.ts";
import Effect from "./effect.types.ts";

/**
 * Events are the interaction of zones, when a zone is accessed a
 * timeline begins where at each step multiple events can trigger.
 *
 * This depends on their probability and priority
 * - priority separates the events in levels:
 *   if 2 events have the same priority only one can trigger, while if
 *   they have diferent priority both can be triggered
 */
interface Event extends Resource {
  probability: number;
  priority: number;
  effect: (Interaction | Relation )[];
}

export default Event;
