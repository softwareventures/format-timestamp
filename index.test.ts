import test from "ava";
import {secondsMs} from "./index";

test("secondsMs", t => {
    t.is(secondsMs({seconds: 0.001}), "00.001");
    t.is(secondsMs({seconds: 1}), "01.000");
    t.is(secondsMs({seconds: 1.0012}), "01.001");
    t.is(secondsMs({seconds: 1.0018}), "01.001");
    t.is(secondsMs({seconds: 22.0018}), "22.001");
});
