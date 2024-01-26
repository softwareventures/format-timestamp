import {concatMap} from "@softwareventures/array";
import type {Timestamp} from "@softwareventures/timestamp";
import {normalize} from "@softwareventures/timestamp";
import * as formatDate from "@softwareventures/format-date";
import {JsDate} from "./js-date";

/** A function that formats a {@link Timestamp} or part of a {@link Timestamp}
 * as a string. */
export type TimestampFormatter = (timestamp: Timestamp) => string;

/** Constructs a function that formats a {@link Timestamp} using the specified
 * template.
 *
 * This function is intended to be used as a template literal tag function.
 *
 * The template may contain placeholders which will be called as functions
 * with the specified {@link Timestamp} as their argument.
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

/** Constructs a function that converts a {@link Timestamp} to the device's
 * local timezone and then formats the Timestamp using the specified template.
 *
 * This function is intended to be used as a template literal tag function.
 *
 * The template may contain placeholders which will be called as functions
 * with the localised {@link Timestamp} as their argument.
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

/** Formats the year portion of the specified {@link Timestamp} as a numeric
 * string. */
export const year = formatDate.year;

/** Formats the year portion of the specified {@link Timestamp} as a numeric
 * string truncated to the last two digits. */
export const shortYear = formatDate.shortYear;

/** Formats the year portion of the specified {@link Timestamp} as a numeric
 * string, zero-padded to at least four digits. */
export const year4 = formatDate.year4;

/** Formats the month portion of the specified {@link Timestamp} as a numeric
 * string. */
export const month = formatDate.month;

/** Formats the month portion of the specified {@link Timestamp} as a 2-digit
 * numeric string. */
export const month2 = formatDate.month2;

export {MonthName} from "@softwareventures/format-date";

/** Formats the name of the month portion of the specified {@link Timestamp}
 * as a string, e.g. `"January"`. */
export const monthName = formatDate.monthName;

/** Formats the day portion of the specified {@link Timestamp} as a numeric
 * string. */
export const day = formatDate.day;

/** Formats the day portion of the specified {@link Timestamp} as a 2-digit
 * numeric string. */
export const day2 = formatDate.day2;

export {DayOfWeek} from "@softwareventures/format-date";

/** Formats the name of the day-of-the-week of the specified {@link Timestamp}
 * as a string, e.g. `"Monday"`. */
export const dayOfWeek = formatDate.dayOfWeek;

/** Formats the hours portion of the specified {@link Timestamp} as a 24-hour
 * numeric string. */
export function hours(timestamp: {readonly hours: number}): string {
    return String(timestamp.hours);
}

/** Formats the hours portion of the specified {@link Timestamp} as a 2-digit
 * 24-hour numeric string. */
export function hours2(timestamp: {readonly hours: number}): string {
    return String(timestamp.hours).padStart(2, "0");
}

/** Formats the hours portion of the specified {@link Timestamp} as a 12-hour
 * numeric string. */
export function hours12(timestamp: {readonly hours: number}): string {
    return String((12 + (timestamp.hours % 12)) % 12);
}

/** Formats the hours portion of the specified {@link Timestamp} as a 2-digit
 * 12-hour numeric string. */
export function hours122(timestamp: {readonly hours: number}): string {
    return String((12 + (timestamp.hours % 12)) % 12).padStart(2, "0");
}

export type AmPm = "AM" | "PM";

/** Returns `"AM"` or `"PM"` depending on the hour of the specified
 * {@link Timestamp}. */
export function amPm(timestamp: {readonly hours: number}): AmPm {
    return timestamp.hours < 12 ? "AM" : "PM";
}

/** Formats the minutes portion of the specified {@link Timestamp} as a
 * numeric string. */
export function minutes(timestamp: {readonly minutes: number}): string {
    return String(timestamp.minutes);
}

/** Formats the minutes portion of the specified {@link Timestamp} as a
 * 2-digit numeric string. */
export function minutes2(timestamp: {readonly minutes: number}): string {
    return String(timestamp.minutes).padStart(2, "0");
}

/** Formats the seconds portion of the specified {@link Timestamp} as a
 * numeric string.
 *
 * Note that fractional seconds will not be rounded, so this might produce
 * a result similar to `"2.234"` */
export function seconds(timestamp: {readonly seconds: number}): string {
    return String(timestamp.seconds);
}

/** Formats the seconds portion of the specified {@link Timestamp} as a
 * numeric string. If necessary, adds a leading zero to the whole part of the
 * seconds to ensure the whole part is at least two digits.
 *
 * Note that fractional seconds will not be rounded, so this might produce
 * a result similar to `"02.234"`. */
export function seconds2(timestamp: {readonly seconds: number}): string {
    return String(timestamp.seconds).replace(/^\d+/u, s => s.padStart(2, "0"));
}

/** Rounds the seconds portion of the specified {@link Timestamp} down and
 * formats the result as a numeric string. */
export function floorSeconds(timestamp: {readonly seconds: number}): string {
    return String(Math.floor(timestamp.seconds));
}

/** Rounds the seconds portion of the specified {@link Timestamp} down and
 * formats the result as a 2-digit numeric string. */
export function floorSeconds2(timestamp: {readonly seconds: number}): string {
    return String(Math.floor(timestamp.seconds)).padStart(2, "0");
}

/** Rounds the seconds portion of the specified {@link Timestamp} down to the
 * next lower millisecond, and formats the result as a 2.3-digit string. */
export function secondsMs(timestamp: {readonly seconds: number}): string {
    const s = String(Math.floor(timestamp.seconds * 1000)).padStart(5, "0");
    return `${s.substr(0, 2)}.${s.substr(2)}`;
}

/** Formats the specified {@link Timestamp} as IS0 8601 extended, rounded down
 * to the next lower second e.g. `"2021-05-01T11:57:23Z"`. */
export const iso8601 = timestampTemplate`${year4}-${month2}-${day2}T${hours2}:${minutes2}:${floorSeconds2}Z`;

/** Converts the specified {@link Timestamp} to the device's local timezone
 * and then formats the result as ISO 8601 extended, rounded down to the next
 * lower second, e.g. `"2021-05-01T11:57:23"`. */
export const deviceLocalIso8601 = deviceLocalTimestampTemplate`${year4}-${month2}-${day2}T${hours2}:${minutes2}:${floorSeconds2}`;
