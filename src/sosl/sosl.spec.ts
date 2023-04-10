import { OPERATORS } from "./enum";
import { SOSL } from "./sosl";

describe("SOSL query builder test suite", () => {
  it("should return empty string", () => {
    const query = new SOSL();
    expect(query.value).toBe("");
  });

  it("should create a SOSL query with find term", () => {
    const query = new SOSL().find("Jhon Doe").value;
    expect(query).toBe("FIND {Jhon Doe}");
  });

  it("should create a SOSL query with find double quoted term", () => {
    const query = new SOSL().find(SOSL.doubleQuote("Jhon Doe")).value;
    expect(query).toBe('FIND {"Jhon Doe"}');
  });

  it("should create a SOSL query with find condition", () => {
    const query = new SOSL().find({
      x: SOSL.doubleQuote("Jhon Doe"),
      op: OPERATORS.AND,
      y: "Brasil",
    }).value;
    expect(query).toBe('FIND {"Jhon Doe" AND Brasil}');
  });

  it("should create a SOSL query with find condition and limit 100", () => {
    const query = new SOSL()
      .find({
        x: SOSL.doubleQuote("Jhon Doe"),
        op: OPERATORS.AND,
        y: "Brasil",
      })
      .limit(100);
    expect(query.value).toBe('FIND {"Jhon Doe" AND Brasil} LIMIT 100');
  });

  it("should create a SOSL query with find condition in Account and limit 100", () => {
    const query = new SOSL()
      .find({
        x: SOSL.doubleQuote("Jhon Doe"),
        op: OPERATORS.AND,
        y: "Brasil",
      })
      .in(["Account"])
      .limit(100);
    expect(query.value).toBe(
      'FIND {"Jhon Doe" AND Brasil} IN Account LIMIT 100'
    );
  });

  it("should create a SOSL query with find condition in Account, Test and limit 100", () => {
    const query = new SOSL()
      .find({
        x: SOSL.doubleQuote("Jhon Doe"),
        op: OPERATORS.AND,
        y: "Brasil",
      })
      .in(["Account", "Test"])
      .limit(100);
    expect(query.value).toBe(
      'FIND {"Jhon Doe" AND Brasil} IN Account Test LIMIT 100'
    );
  });

  it("should create a SOSL query with find condition in Account, Test returning name and limit 100", () => {
    const query = new SOSL()
      .find({
        x: SOSL.doubleQuote("Jhon Doe"),
        op: OPERATORS.AND,
        y: "Brasil",
      })
      .in(["Account", "Test"])
      .returning(["Name"])
      .limit(100);
    expect(query.value).toBe(
      'FIND {"Jhon Doe" AND Brasil} IN Account Test RETURNING Name LIMIT 100'
    );
  });

  it("should create a SOSL query with find term returning Account with where condition and limit 100", () => {
    const query = new SOSL().find("test").returning(["Account"]).where(["id"], {
      x: "createdDate",
      op: OPERATORS.EQUAL,
      y: "THIS_FISCAL_QUARTER",
    });
    expect(query.value).toBe(
      "FIND {test} RETURNING Account (id WHERE createdDate = THIS_FISCAL_QUARTER)"
    );
  });

  it("should create a SOSL query with find term in ALL FIELDS returning Knowledge__kav", () => {
    const query = new SOSL()
      .find("article")
      .in(["ALL FIELDS"])
      .returning(["Knowledge__kav"])
      .where(["Id", "Title", "Summary", "SelfServiceResponse__c"]);
    expect(query.value).toBe(
      "FIND {article} IN ALL FIELDS RETURNING Knowledge__kav (Id, Title, Summary, SelfServiceResponse__c)"
    );
  });

  it("should create a SOSL query with find term in ALL FIELDS returning Knowledge__kav with condition and limit 100", () => {
    const query = new SOSL()
      .find("article")
      .in(["ALL FIELDS"])
      .returning(["Knowledge__kav"])
      .where(["Id", "Title", "Summary", "SelfServiceResponse__c"], {
        x: "Id",
        op: OPERATORS.EQUAL,
        y: "test",
      });
    expect(query.value).toBe(
      "FIND {article} IN ALL FIELDS RETURNING Knowledge__kav (Id, Title, Summary, SelfServiceResponse__c WHERE Id = test)"
    );
  });

  it("should create a SOSL query with find term in ALL FIELDS returning Knowledge__kav with three conditions and limit 100", () => {
    const query = new SOSL()
      .find("article")
      .in(["ALL FIELDS"])
      .returning(["Knowledge__kav"])
      .where(["Id", "Title", "Summary", "SelfServiceResponse__c"], {
        x: {
          x: "Id",
          op: OPERATORS.EQUAL,
          y: "test",
        },
        op: OPERATORS.EQUAL,
        y: {
          x: "Id",
          op: OPERATORS.EQUAL,
          y: "test",
        },
      });
    expect(query.value).toBe(
      `FIND {article} IN ALL FIELDS RETURNING Knowledge__kav (Id, Title, Summary, SelfServiceResponse__c WHERE (Id = test) = (Id = test))`
    );
  });

  it("should create a SOSL query with find term in ALL FIELDS returning Knowledge__kav with two conditions and limit 100", () => {
    const query = new SOSL()
      .find("article")
      .in(["ALL FIELDS"])
      .returning(["Knowledge__kav"])
      .where(["Id", "Title", "Summary", "SelfServiceResponse__c"], {
        x: "Id",
        op: OPERATORS.EQUAL,
        y: {
          x: "Id",
          op: OPERATORS.EQUAL,
          y: "test",
        },
      });
    expect(query.value).toBe(
      `FIND {article} IN ALL FIELDS RETURNING Knowledge__kav (Id, Title, Summary, SelfServiceResponse__c WHERE Id = (Id = test))`
    );
  });

  it("should create a SOSL query with find term in ALL FIELDS returning Knowledge__kav with two conditions and limit 100", () => {
    const query = new SOSL()
      .find("article")
      .in(["ALL FIELDS"])
      .returning(["Knowledge__kav"])
      .where(["Id", "Title", "Summary", "SelfServiceResponse__c"], {
        x: {
          x: "Id",
          op: OPERATORS.EQUAL,
          y: "test",
        },
        op: OPERATORS.EQUAL,
        y: "test",
      });
    expect(query.value).toBe(
      `FIND {article} IN ALL FIELDS RETURNING Knowledge__kav (Id, Title, Summary, SelfServiceResponse__c WHERE (Id = test) = test)`
    );
  });

  it("should create SOSL query finding term in Knowledge__kav by model year", () => {
    const year = SOSL.doubleQuote("2005");
    const query = new SOSL()
      .find("test")
      .in(["ALL FIELDS"])
      .returning(["Knowledge__kav"])
      .where(["Id"], {
        x: {
          x: year,
          op: OPERATORS.GREATER_OR_EQUAL,
          y: "VehicleModelYearStartYear__c",
        },
        op: OPERATORS.AND,
        y: {
          x: year,
          op: OPERATORS.LESS_OR_EQUAL,
          y: "VehicleModelYearEndYear__c",
        },
      });
    expect(query.value).toBe(
      'FIND {test} IN ALL FIELDS RETURNING Knowledge__kav (Id WHERE ("2005" >= VehicleModelYearStartYear__c) AND ("2005" <= VehicleModelYearEndYear__c))'
    );
  });
});
