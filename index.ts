import {concatMap} from "@softwareventures/array";
import {normalize, Timestamp} from "@softwareventures/timestamp";
import * as formatDate from "@softwareventures/format-date";
import {JsDate} from "./js-date";

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

/** Constructs a function that converts a Timestamp to the device's local
 * timezone and then formats the Timestamp using the specified template.
 *
 * This function is intended to be used as a template literal tag function.
 *
 * The template may contain placeholders which will be called as functions
 * with the localised Timestamp as their argument.
 *
 * @example
 * const formatDeviceLocal = deviceLocalTimestampTemplate`${hours2}:${minutes2}:${seconds2} ${day2}/${month2}/${year2}`;
 * const text = formatDeviceLocal(timestamp); */
export function deviceLocalTimestampTemplate(
    texts: TemplateStringsArray,
    ...formatters: readonly TimestampFormatter[]
): TimestampFormatter {
    return timestamp => {
        const {year, month, day, hours, minutes} = timestamp;
        const seconds = Math.floor(timestamp.seconds);
        const ms = (timestamp.seconds - seconds) * 1000;
        const jsDate = new JsDate();
        jsDate.setUTCFullYear(year, month - 1, day);
        jsDate.setUTCHours(hours, minutes, seconds, ms);
        const local = normalize({
            year: jsDate.getFullYear(),
            month: jsDate.getMonth() + 1,
            day: jsDate.getDate(),
            hours: jsDate.getHours(),
            minutes: jsDate.getMinutes(),
            seconds: jsDate.getSeconds() + jsDate.getMilliseconds() / 1000
        });
        return concatMap(texts, (text, i) => [text, formatters[i]?.(local)]).join("");
    };
}

/** Formats the year portion of the specified Timestamp as a numeric string. */
export const year = formatDate.year;

/** Formats the year portion of the specified Timestamp as a numeric string
 * truncated to the last two digits. */
export const shortYear = formatDate.shortYear;

/** Formats the year portion of the specified Timestamp as a numeric string,
 * zero-padded to at least four digits. */
export const year4 = formatDate.year4;

/** Formats the month portion of the specified Timestamp as a numeric string. */
export const month = formatDate.month;

/** Formats the month portion of the specified Timestamp as a 2-digit numeric
 * string. */
export const month2 = formatDate.month2;
