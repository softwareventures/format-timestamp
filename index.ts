import {concatMap} from "@softwareventures/array";
import {Timestamp} from "@softwareventures/timestamp";

/** A function that formats a Timestamp or part of a Timestamp as a string. */
export type TimestampFormatter = (timestamp: Timestamp) => string;

/** Constructs a function that formats a Timestamp using the specified
 * template.
 *
 * This function is intended to be used as a template literal tag function.
 *
 * The template may contain placeholders which will be called as functions
 * with the specified Timestamp as their argument.
 *
 * @example
 * const format = timestampTemplate`${hours2}:${minutes2}:${seconds2} ${day2}/${month2}/${year2}`;
 * const text = format(timestamp); */
export function timestampTemplate(
    texts: TemplateStringsArray,
    ...formatters: readonly TimestampFormatter[]
): TimestampFormatter {
    return timestamp => concatMap(texts, (text, i) => [text, formatters[i]?.(timestamp)]).join("");
}
