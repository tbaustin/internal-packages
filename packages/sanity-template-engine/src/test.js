import TemplateEngine from './index'
import schema from './sample-schema'
import data from './sample-data'


const engine = TemplateEngine({ schema, data })


test(`Resolves a single property by field title`, () => {
  expect(engine.resolveProperty(`Title`)).toBe(`The Matrix`)
  expect(engine.resolveProperty(`Other Info:Release Year`)).toBe(1999)
  expect(engine.resolveProperty(`Other Info:Tags:2`)).toBe(`Sci-Fi`)

  expect(
    engine.resolveProperty(`Directors:1:Full Name:First Name`)
  ).toBe(`Lana`)

  const cast = engine.resolveProperty(`Cast`)
  expect(cast).toBeInstanceOf(Array)
  expect(cast).toHaveLength(3)

  const actorName = engine.resolveProperty(`Cast:3:Actor:Full Name`)
  expect(actorName).toMatchObject({
    first: `Carrie-Anne`,
    last: `Moss`
  })

  expect(engine.resolveProperty(`Cast:3:Role`)).toBe(`Trinity`)
})


test(`Replaces template variables in a string`, () => {
  const templateString = [
    `Title: {{Title}}\n`,
    `Starring: {{Cast:1:Actor:Full Name:First Name}} `,
    `{{Cast:1:Actor:Full Name:Last Name}}\n`,
    `Main Character: {{Cast:1:Role}}`
  ].join(``)

  const expectedParsed = [
    `Title: The Matrix`,
    `Starring: Keanu Reeves`,
    `Main Character: Neo`
  ].join(`\n`)

  const parsed = engine.parse(templateString)
  expect(expectedParsed).toBe(parsed)
})
