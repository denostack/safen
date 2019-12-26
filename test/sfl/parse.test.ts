import { parse } from '../../lib/sfl/parse'

function createError(message: string, code: string, line: number, column: number) {
  return Object.assign(new Error(message), {
    code,
    line,
    column,
  })
}

describe('parse', () => {
  it('test scalar success', () => {
    expect(parse('string')).toEqual({
      type: 'scalar',
      name: 'string',
      params: [],
    })

    expect(parse('email')).toEqual({
      type: 'scalar',
      name: 'email',
      params: [],
    })

    expect(parse('email()')).toEqual({
      type: 'scalar',
      name: 'email',
      params: [],
    })

    expect(parse('email(true)')).toEqual({
      type: 'scalar',
      name: 'email',
      params: [true],
    })

    expect(parse('email(true,)')).toEqual({
      type: 'scalar',
      name: 'email',
      params: [true],
    })

    expect(parse('email(true, false, null, "string", 3.14, -500.5, /ab\\/c/igm)')).toEqual({
      type: 'scalar',
      name: 'email',
      params: [true, false, null, 'string', 3.14, -500.5, /ab\/c/gim],
    })

    expect(parse(`  
        string   
      `)).toEqual({
      type: 'scalar',
      name: 'string',
      params: [],
    })

    expect(parse(`  
        email   
      `)).toEqual({
      type: 'scalar',
      name: 'email',
      params: [],
    })
  })

  it('test scalar fail', () => {
    expect(() => parse('?string')).toThrowError(createError(`Syntax Error: expected tester, unexpected token "?" (1:1)
1: ?string
   ^`, 'SYNTAX_ERROR', 1, 1))
    expect(() => parse('str?ing')).toThrowError(createError(`Syntax Error: expected EOF, unexpected token "?" (1:4)
1: str?ing
      ^`, 'SYNTAX_ERROR', 1, 4))

    expect(() => parse(`
      ?string
    `)).toThrowError(createError(`Syntax Error: expected tester, unexpected token "?" (2:7)
2:       ?string
         ^`, 'SYNTAX_ERROR', 2, 7))

    expect(() => parse('email(,)')).toThrowError(createError(`Syntax Error: expected ), unexpected token "," (1:7)
1: email(,)
         ^`, 'SYNTAX_ERROR', 1, 7))

    expect(() => parse('email(true,,)')).toThrowError(createError(`Syntax Error: expected ), unexpected token "," (1:12)
1: email(true,,)
              ^`, 'SYNTAX_ERROR', 1, 12))

  })

  it('test expression success', () => {
    expect(parse('string | email | something')).toEqual({ type: 'or',
      params: [
        { type: 'scalar', name: 'string', params: [] },
        { type: 'scalar', name: 'email', params: [] },
        { type: 'scalar', name: 'something', params: [] },
      ] })

    expect(parse('string & email & something')).toEqual({ type: 'and',
      params: [
        { type: 'scalar', name: 'string', params: [] },
        { type: 'scalar', name: 'email', params: [] },
        { type: 'scalar', name: 'something', params: [] },
      ] })

    expect(parse('string & email | string & phone')).toEqual({ type: 'or',
      params: [
        { type: 'and',
          params: [
            { type: 'scalar', name: 'string', params: [] },
            { type: 'scalar', name: 'email', params: [] },
          ] },
        { type: 'and',
          params: [
            { type: 'scalar', name: 'string', params: [] },
            { type: 'scalar', name: 'phone', params: [] },
          ] },
      ] })

    expect(parse('string | string & email | phone')).toEqual({ type: 'or',
      params: [
        { type: 'scalar', name: 'string', params: [] },
        { type: 'and',
          params: [
            { type: 'scalar', name: 'string', params: [] },
            { type: 'scalar', name: 'email', params: [] },
          ] },
        { type: 'scalar', name: 'phone', params: [] },
      ] })

    expect(parse('(string | email) & (string | phone)')).toEqual({ type: 'and',
      params: [
        { type: 'or',
          params: [
            { type: 'scalar', name: 'string', params: [] },
            { type: 'scalar', name: 'email', params: [] },
          ] },
        { type: 'or',
          params: [
            { type: 'scalar', name: 'string', params: [] },
            { type: 'scalar', name: 'phone', params: [] },
          ] },
      ] })

  })

  it('test object success', () => {
    expect(parse('{}')).toEqual({ type: 'object', properties: {} })
    expect(parse(' { } ')).toEqual({ type: 'object', properties: {} })

    expect(parse(`{
      name: string,
      username: string & email
    }`)).toEqual({ type: 'object',
      properties: {
        name: { optional: false, value: { type: 'scalar', name: 'string', params: [] } },
        username: { optional: false,
          value: { type: 'and',
            params: [
              { type: 'scalar', name: 'string', params: [] },
              { type: 'scalar', name: 'email', params: [] },
            ] } },
      } })

    expect(parse(`{
      name?: string,
      username: string & email
    }`)).toEqual({ type: 'object',
      properties: {
        name: { optional: true, value: { type: 'scalar', name: 'string', params: [] } },
        username: { optional: false,
          value: { type: 'and',
            params: [
              { type: 'scalar', name: 'string', params: [] },
              { type: 'scalar', name: 'email', params: [] },
            ] } },
      } })

    expect(parse(`{
      name?: string,
      username?: (string & email) | null,
    }`)).toEqual({ type: 'object',
      properties: {
        name: { optional: true, value: { type: 'scalar', name: 'string', params: [] } },
        username: { optional: true,
          value: { type: 'or',
            params: [
              { type: 'and',
                params: [
                  { type: 'scalar', name: 'string', params: [] },
                  { type: 'scalar', name: 'email', params: [] },
                ] },
              { type: 'scalar', name: 'null', params: [] },
            ] } },
      } })

    expect(parse(`{
      name: string,
      username: string & email & in("abc", "def", 10, 20)
    } | null`)).toEqual({ type: 'or',
      params: [
        { type: 'object',
          properties: {
            name: { optional: false, value: { type: 'scalar', name: 'string', params: [] } },
            username: { optional: false,
              value: { type: 'and',
                params: [
                  { type: 'scalar', name: 'string', params: [] },
                  { type: 'scalar', name: 'email', params: [] },
                  { type: 'scalar', name: 'in', params: ['abc', 'def', 10, 20] },
                ] } },
          } },
        { type: 'scalar', name: 'null', params: [] },
      ] })
  })

  it('test array success', () => {
    expect(parse('string[]')).toEqual({ type: 'array', value: { type: 'scalar', name: 'string', params: [] } })
    expect(parse('string[1]')).toEqual({ type: 'array', min: 1, max: 1, value: { type: 'scalar', name: 'string', params: [] } })
    expect(parse('string[1:]')).toEqual({ type: 'array', min: 1, value: { type: 'scalar', name: 'string', params: [] } })
    expect(parse('string[:2]')).toEqual({ type: 'array', max: 2, value: { type: 'scalar', name: 'string', params: [] } })
    expect(parse('string[1:2]')).toEqual({ type: 'array', min: 1, max: 2, value: { type: 'scalar', name: 'string', params: [] } })

    expect(parse('string[][]')).toEqual({ type: 'array', value: { type: 'array', value: { type: 'scalar', name: 'string', params: [] } } })
    expect(parse('string[ 1 ][]')).toEqual({ type: 'array', value: { type: 'array', min: 1, max: 1, value: { type: 'scalar', name: 'string', params: [] } } })
    expect(parse('string[ 1 : ][]')).toEqual({ type: 'array', value: { type: 'array', min: 1, value: { type: 'scalar', name: 'string', params: [] } } })
    expect(parse('string[ : 2 ][]')).toEqual({ type: 'array', value: { type: 'array', max: 2, value: { type: 'scalar', name: 'string', params: [] } } })
    expect(parse('string[ 1 : 2 ][]')).toEqual({ type: 'array', value: { type: 'array', min: 1, max: 2, value: { type: 'scalar', name: 'string', params: [] } } })

    expect(parse(`{
      name: string,
      username: string & email & in("abc", "def", 10, 20)
    }[]`)).toEqual({ type: 'array',
      value: { type: 'object',
        properties: { name: { optional: false, value: { type: 'scalar', name: 'string', params: [] } },
          username: { optional: false,
            value: { type: 'and',
              params: [
                { type: 'scalar', name: 'string', params: [] },
                { type: 'scalar', name: 'email', params: [] },
                { type: 'scalar', name: 'in', params: ['abc', 'def', 10, 20] },
              ] } } } } })

    expect(parse(`{
      name: string,
      username: string & email & in("abc", "def", 10, 20)
    }[] | null`)).toEqual({ type: 'or',
      params: [
        { type: 'array',
          value: { type: 'object',
            properties: {
              name: { optional: false, value: { type: 'scalar', name: 'string', params: [] } },
              username: { optional: false,
                value: { type: 'and',
                  params: [
                    { type: 'scalar', name: 'string', params: [] },
                    { type: 'scalar', name: 'email', params: [] },
                    { type: 'scalar', name: 'in', params: ['abc', 'def', 10, 20] },
                  ] } },
            } } },
        { type: 'scalar', name: 'null', params: [] },
      ] })

    expect(parse(`({
      name: string,
      username: string & email & in("abc", "def", 10, 20)
    } | null)[][5]`)).toEqual({ type: 'array',
      min: 5,
      max: 5,
      value: { type: 'array',
        value: { type: 'or',
          params: [
            { type: 'object',
              properties: {
                name: { optional: false, value: { type: 'scalar', name: 'string', params: [] } },
                username: { optional: false,
                  value: { type: 'and',
                    params: [
                      { type: 'scalar', name: 'string', params: [] },
                      { type: 'scalar', name: 'email', params: [] },
                      { type: 'scalar', name: 'in', params: ['abc', 'def', 10, 20] },
                    ] } },
              } },
            { type: 'scalar', name: 'null', params: [] },
          ] } } })

    expect(parse(` ( ( ( ( {
      name     : string   ,
      username : ( string & email ) & in ( "abc" , "def" , 10 , 20 )
    } | null ) ) ) [ ] ) [ 5 ]`)).toEqual({ type: 'array',
      min: 5,
      max: 5,
      value: { type: 'array',
        value: { type: 'or',
          params: [
            { type: 'object',
              properties: {
                name: { optional: false, value: { type: 'scalar', name: 'string', params: [] } },
                username: { optional: false,
                  value: { type: 'and',
                    params: [
                      { type: 'and',
                        params: [
                          { type: 'scalar', name: 'string', params: [] },
                          { type: 'scalar', name: 'email', params: [] },
                        ] },
                      { type: 'scalar', name: 'in', params: ['abc', 'def', 10, 20] },
                    ] } },
              } },
            { type: 'scalar', name: 'null', params: [] },
          ] } } })
  })
})
