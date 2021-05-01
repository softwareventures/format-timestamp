import test from "ava";
import {timestamp} from "@softwareventures/timestamp";
import {iso8601, secondsMs} from "./index";

test("secondsMs", t => {
    t.is(secondsMs({seconds: 0.001}), "00.001");
    t.is(secondsMs({seconds: 1}), "01.000");
    t.is(secondsMs({seconds: 1.0012}), "01.001");
    t.is(secondsMs({seconds: 1.0018}), "01.001");
    t.is(secondsMs({seconds: 22.0018}), "22.001");
});

test("iso8601", t => {
    t.is(
        iso8601(timestamp({year: 2021, month: 5, day: 1, hours: 11, minutes: 58, seconds: 27.239})),
        "2021-05-01T11:58:27Z"
    );
});
