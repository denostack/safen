import { alpha } from "./decorators/alpha.ts";
import { alphanum } from "./decorators/alphanum.ts";
import { ascii } from "./decorators/ascii.ts";
import { base64 } from "./decorators/base64.ts";
import { between } from "./decorators/between.ts";
import { ceil } from "./decorators/ceil.ts";
import { creditcard } from "./decorators/creditcard.ts";
import { dateformat } from "./decorators/dateformat.ts";
import { email } from "./decorators/email.ts";
import { emptyToNull } from "./decorators/empty_to_null.ts";
import { floor } from "./decorators/floor.ts";
import { hexcolor } from "./decorators/hexcolor.ts";
import { ip } from "./decorators/ip.ts";
import { json } from "./decorators/json.ts";
import { lengthBetween } from "./decorators/length_between.ts";
import { lengthMax } from "./decorators/length_max.ts";
import { lengthMin } from "./decorators/length_min.ts";
import { length } from "./decorators/length.ts";
import { lowercase } from "./decorators/lowercase.ts";
import { macaddress } from "./decorators/macaddress.ts";
import { min } from "./decorators/min.ts";
import { max } from "./decorators/max.ts";
import { port } from "./decorators/port.ts";
import { re } from "./decorators/re.ts";
import { round } from "./decorators/round.ts";
import { stringify } from "./decorators/stringify.ts";
import { toLower } from "./decorators/to_lower.ts";
import { toUpper } from "./decorators/to_upper.ts";
import { trim } from "./decorators/trim.ts";
import { uppercase } from "./decorators/uppercase.ts";
import { url } from "./decorators/url.ts";
import { uuid } from "./decorators/uuid.ts";

export const d = {
  alpha,
  alphanum,
  ascii,
  base64,
  between,
  ceil,
  creditcard,
  dateformat,
  email,
  emptyToNull,
  floor,
  hexcolor,
  ip,
  json,
  lengthBetween,
  lengthMax,
  lengthMin,
  length,
  lowercase,
  macaddress,
  min,
  max,
  port,
  re,
  round,
  stringify,
  toLower,
  toUpper,
  trim,
  uppercase,
  url,
  uuid,
};

export type PredefinedDecorators = typeof d;
