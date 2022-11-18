import { assertEquals, assertThrows } from "testing/asserts.ts";
import {
  alpha,
  alphanum,
  ascii,
  base64,
  between,
  creditcard,
  dateformat,
  email,
  hexcolor,
  ip,
  json,
  length,
  lengthBetween,
  lengthMax,
  lengthMin,
  lowercase,
  macaddress,
  max,
  min,
  port,
  re,
  trim,
  uppercase,
  url,
  uuid,
} from "./decorators.ts";
import { decorate } from "./schema/utils.ts";
import { createSanitize } from "./validator/create_sanitize.ts";
import { InvalidValueError } from "./validator/invalid_value_error.ts";

Deno.test("decorators, alpha", () => {
  const s = createSanitize(decorate(String, alpha()));

  assertEquals(s("abcdefghijklmnopqrstuvwxyz"), "abcdefghijklmnopqrstuvwxyz");

  const e = assertThrows(
    () => {
      s("1");
    },
    InvalidValueError,
    "This is an invalid value from decorator.",
  );
  assertEquals(e.reason, "#alpha");
});

Deno.test("decorators, alphanum", () => {
  const s = createSanitize(decorate(String, alphanum()));

  assertEquals(s("abcdefghijklmnopqrstuvwxyz1"), "abcdefghijklmnopqrstuvwxyz1");
  assertEquals(s("1"), "1");

  const e = assertThrows(
    () => {
      s("äbc1");
    },
    InvalidValueError,
    "This is an invalid value from decorator.",
  );
  assertEquals(e.reason, "#alphanum");
});

Deno.test("decorators, ascii", () => {
  const s = createSanitize(decorate(String, ascii()));

  assertEquals(s("abcdefghijklmnopqrstuvwxyz"), "abcdefghijklmnopqrstuvwxyz");
  assertEquals(s("0123456789"), "0123456789");
  assertEquals(s("!@#$%^&*()"), "!@#$%^&*()");

  const e = assertThrows(
    () => {
      s("äbc");
    },
    InvalidValueError,
    "This is an invalid value from decorator.",
  );
  assertEquals(e.reason, "#ascii");
});

Deno.test("decorators, base64", () => {
  const s = createSanitize(decorate(String, base64()));

  assertEquals(s("Zg=="), "Zg==");

  const e = assertThrows(
    () => {
      s("Zg=");
    },
    InvalidValueError,
    "This is an invalid value from decorator.",
  );
  assertEquals(e.reason, "#base64");
});

Deno.test("decorators, between", () => {
  const s1 = createSanitize(decorate(Number, between(2, 3)));
  assertEquals(s1(2), 2);
  assertEquals(s1(3), 3);

  {
    const e = assertThrows(
      () => {
        s1(1);
      },
      InvalidValueError,
      "This is an invalid value from decorator.",
    );
    assertEquals(e.reason, "#between(2,3)");
    assertThrows(
      () => {
        s1(4);
      },
      InvalidValueError,
      "This is an invalid value from decorator.",
    );
  }
});

Deno.test("decorators, creditcard", () => {
  const s = createSanitize(decorate(String, creditcard()));

  assertEquals(s("4716-2210-5188-5662"), "4716-2210-5188-5662");
  assertEquals(s("4929 7226 5379 7141"), "4929 7226 5379 7141");

  const e = assertThrows(
    () => {
      s("5398228707871528");
    },
    InvalidValueError,
    "This is an invalid value from decorator.",
  );
  assertEquals(e.reason, "#creditcard");
});

Deno.test("decorators, dateformat", () => {
  const s = createSanitize(decorate(String, dateformat()));

  assertEquals(s("2018-12-25"), "2018-12-25");
  assertEquals(s("12/25/2018"), "12/25/2018");
  assertEquals(s("Dec 25, 2018"), "Dec 25, 2018");

  const e = assertThrows(
    () => {
      s("1539043200000");
    },
    InvalidValueError,
    "This is an invalid value from decorator.",
  );
  assertEquals(e.reason, "#dateformat");
});

Deno.test("decorators, email", () => {
  const s = createSanitize(decorate(String, email()));

  assertEquals(s("wan2land+en@gmail.com"), "wan2land+en@gmail.com");
  const e = assertThrows(
    () => {
      s("unknown");
    },
    InvalidValueError,
    "This is an invalid value from decorator.",
  );
  assertEquals(e.reason, "#email");
});

Deno.test("decorators, hexcolor", () => {
  const s = createSanitize(decorate(String, hexcolor()));

  assertEquals(s("#CCCCCC"), "#CCCCCC");
  const e = assertThrows(
    () => {
      s("#ff");
    },
    InvalidValueError,
    "This is an invalid value from decorator.",
  );
  assertEquals(e.reason, "#hexcolor");
});

Deno.test("decorators, ip", () => {
  const s1 = createSanitize(decorate(String, ip()));

  assertEquals(s1("127.0.0.1"), "127.0.0.1");
  assertEquals(s1("2001:db8:0000:1:1:1:1:1"), "2001:db8:0000:1:1:1:1:1");
  {
    const e = assertThrows(
      () => {
        s1("256.0.0.0");
      },
      InvalidValueError,
      "This is an invalid value from decorator.",
    );
    assertEquals(e.reason, "#ip");
  }

  const s2 = createSanitize(decorate(String, ip("v4")));

  assertEquals(s2("127.0.0.1"), "127.0.0.1");
  {
    const e = assertThrows(
      () => {
        s2("256.0.0.0");
      },
      InvalidValueError,
      "This is an invalid value from decorator.",
    );
    assertEquals(e.reason, "#ip(v4)");
    assertThrows(
      () => {
        s2("2001:db8:0000:1:1:1:1:1");
      },
      InvalidValueError,
      "This is an invalid value from decorator.",
    );
  }

  const s3 = createSanitize(decorate(String, ip("v6")));

  assertEquals(s3("2001:db8:0000:1:1:1:1:1"), "2001:db8:0000:1:1:1:1:1");
  {
    const e = assertThrows(
      () => {
        s3("256.0.0.0");
      },
      InvalidValueError,
      "This is an invalid value from decorator.",
    );
    assertEquals(e.reason, "#ip(v6)");
    assertThrows(
      () => {
        s3("127.0.0.1");
      },
      InvalidValueError,
      "This is an invalid value from decorator.",
    );
  }
});

Deno.test("decorators, json", () => {
  const s = createSanitize(decorate(String, json()));

  assertEquals(s("{}"), "{}");
  const e = assertThrows(
    () => {
      s("a");
    },
    InvalidValueError,
    "This is an invalid value from decorator.",
  );
  assertEquals(e.reason, "#json");
});

Deno.test("decorators, lengthBetween", () => {
  const s1 = createSanitize(decorate(String, lengthBetween(2, 3)));
  assertEquals(s1("ab"), "ab");
  assertEquals(s1("abc"), "abc");

  {
    const e = assertThrows(
      () => {
        s1("a");
      },
      InvalidValueError,
      "This is an invalid value from decorator.",
    );
    assertEquals(e.reason, "#lengthBetween(2,3)");
    assertThrows(
      () => {
        s1("abcd");
      },
      InvalidValueError,
      "This is an invalid value from decorator.",
    );
  }

  const s2 = createSanitize(decorate(Array, lengthBetween(2, 3)));
  assertEquals(s2([1, 2]), [1, 2]);
  assertEquals(s2([1, 2, 3]), [1, 2, 3]);

  {
    const e = assertThrows(
      () => {
        s2([1]);
      },
      InvalidValueError,
      "This is an invalid value from decorator.",
    );
    assertEquals(e.reason, "#lengthBetween(2,3)");
    assertThrows(
      () => {
        s2([1, 2, 3, 4]);
      },
      InvalidValueError,
      "This is an invalid value from decorator.",
    );
  }
});

Deno.test("decorators, lengthMax", () => {
  const s = createSanitize(decorate(String, lengthMax(3)));
  assertEquals(s("a"), "a");
  assertEquals(s("ab"), "ab");
  assertEquals(s("abc"), "abc");

  const e = assertThrows(
    () => {
      s("abcd");
    },
    InvalidValueError,
    "This is an invalid value from decorator.",
  );
  assertEquals(e.reason, "#lengthMax(3)");
});

Deno.test("decorators, lengthMin", () => {
  const s = createSanitize(decorate(String, lengthMin(2)));
  assertEquals(s("ab"), "ab");
  assertEquals(s("abc"), "abc");

  const e = assertThrows(
    () => {
      s("a");
    },
    InvalidValueError,
    "This is an invalid value from decorator.",
  );
  assertEquals(e.reason, "#lengthMin(2)");
});

Deno.test("decorators, length", () => {
  const s = createSanitize(decorate(String, length(2)));
  assertEquals(s("ab"), "ab");

  const e = assertThrows(
    () => {
      s("a");
    },
    InvalidValueError,
    "This is an invalid value from decorator.",
  );
  assertEquals(e.reason, "#length(2)");
  assertThrows(
    () => {
      s("abcd");
    },
    InvalidValueError,
    "This is an invalid value from decorator.",
  );
});

Deno.test("decorators, lowercase", () => {
  const s = createSanitize(decorate(String, lowercase()));

  assertEquals(s("abcd"), "abcd");

  const e = assertThrows(
    () => {
      s("ABCD");
    },
    InvalidValueError,
    "This is an invalid value from decorator.",
  );
  assertEquals(e.reason, "#lowercase");
});

Deno.test("decorators, macaddress", () => {
  const s = createSanitize(decorate(String, macaddress()));

  assertEquals(s("ab:ab:ab:ab:ab:ab"), "ab:ab:ab:ab:ab:ab");

  const e = assertThrows(
    () => {
      s("01:02:03:04:05");
    },
    InvalidValueError,
    "This is an invalid value from decorator.",
  );
  assertEquals(e.reason, "#macaddress");
});

Deno.test("decorators, max", () => {
  const s = createSanitize(decorate(Number, max(2)));

  assertEquals(s(2), 2);

  const e = assertThrows(
    () => {
      s(3);
    },
    InvalidValueError,
    "This is an invalid value from decorator.",
  );
  assertEquals(e.reason, "#max(2)");
});

Deno.test("decorators, min", () => {
  const s = createSanitize(decorate(Number, min(2)));

  assertEquals(s(2), 2);

  const e = assertThrows(
    () => {
      s(1);
    },
    InvalidValueError,
    "This is an invalid value from decorator.",
  );
  assertEquals(e.reason, "#min(2)");
});

Deno.test("decorators, port", () => {
  const s = createSanitize(decorate(Number, port()));

  assertEquals(s(0), 0);
  assertEquals(s(1), 1);
  assertEquals(s(65534), 65534);
  assertEquals(s(65535), 65535);

  const e = assertThrows(
    () => {
      s(65536);
    },
    InvalidValueError,
    "This is an invalid value from decorator.",
  );
  assertEquals(e.reason, "#port");
});

Deno.test("decorators, re", () => {
  const s = createSanitize(decorate(String, re(/^abc?$/i)));

  assertEquals(s("abc"), "abc");

  const e = assertThrows(
    () => {
      s("github");
    },
    InvalidValueError,
    "This is an invalid value from decorator.",
  );
  assertEquals(e.reason, "#re(/^abc?$/i)");
});

Deno.test("decorators, trim", () => {
  const s = createSanitize(decorate(String, trim()));

  assertEquals(s("  abcd\n\n\r\t"), "abcd");
});

Deno.test("decorators, uppercase", () => {
  const s = createSanitize(decorate(String, uppercase()));

  assertEquals(s("ABCD"), "ABCD");

  const e = assertThrows(
    () => {
      s("abcd");
    },
    InvalidValueError,
    "This is an invalid value from decorator.",
  );
  assertEquals(e.reason, "#uppercase");
});

Deno.test("decorators, url", () => {
  const s = createSanitize(decorate(String, url()));

  assertEquals(
    s("http://github.com/corgidisco"),
    "http://github.com/corgidisco",
  );
  assertEquals(s("github.com"), "github.com");

  const e = assertThrows(
    () => {
      s("github");
    },
    InvalidValueError,
    "This is an invalid value from decorator.",
  );
  assertEquals(e.reason, "#url");
});

Deno.test("decorators, uuid", () => {
  const s = createSanitize(decorate(String, uuid()));

  assertEquals(
    s("A987FBC9-4BED-3078-CF07-9141BA07C9F3"),
    "A987FBC9-4BED-3078-CF07-9141BA07C9F3",
  );
  const e = assertThrows(
    () => {
      s("xxxA987FBC9-4BED-3078-CF07-9141BA07C9F3");
    },
    InvalidValueError,
    "This is an invalid value from decorator.",
  );
  assertEquals(e.reason, "#uuid");
});
