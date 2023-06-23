/* eslint-disable no-undef */
const SessionBuilder = require("../src/SessionBuilder");

describe("Проверка класса SessionBuilder", () => {
  test("Проверка статичного метода .create()", async () => {
    const session = SessionBuilder.create();
    expect(typeof session.create === "function").toBeTruthy();
  });
});
