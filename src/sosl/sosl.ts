import { Condition } from "./types";

export class SOSL {
  private findValue: string;
  private findCondition: Condition;
  private limitValue: number;
  private inValues: Array<string> = [];
  private returningValues: Array<string> = [];
  private whereCondition: Condition;
  private whereFields: Array<string> = [];

  get value() {
    const findClause = this.findCondition
      ? `FIND {${this.parseCondition(this.findCondition)}}`
      : this.findValue
      ? `FIND {${this.findValue}}`
      : "";

    const inClause = this.inValues.length
      ? `IN ${this.inValues.join(" ")}`
      : "";

    const returningClause = this.returningValues.length
      ? `RETURNING ${this.returningValues.join(" ")}`
      : "";

    const whereClause = this.whereFields.length
      ? `(${this.whereFields.join(", ")} ${
          this.whereCondition
            ? `WHERE ${this.parseCondition(this.whereCondition)}`
            : ""
        })`
          .replace(/( \))+/g, ")")
          .replace(/(\( )+/g, "(")
      : "";

    const limitClause = this.limitValue ? `LIMIT ${this.limitValue}` : "";

    return `${findClause} ${inClause} ${returningClause} ${whereClause} ${limitClause}`
      .replace(/  +/g, " ")
      .trim();
  }

  find(condition: Condition | string) {
    if (typeof condition === "string") {
      this.findValue = condition;
    } else {
      this.findCondition = condition;
    }
    return this;
  }

  in(values: Array<string>) {
    this.inValues = [...new Set(this.inValues.concat(values))];
    return this;
  }

  returning(values: Array<string>) {
    this.returningValues = [...new Set(this.returningValues.concat(values))];
    return this;
  }

  where(fields: Array<string>, condition?: Condition) {
    this.whereFields = [...new Set(fields)];
    this.whereCondition = condition;
    return this;
  }

  limit(limitValue: number) {
    this.limitValue = limitValue;
    return this;
  }

  private parseCondition(condition: Condition) {
    const { x, op, y } = condition;

    if (typeof x !== "string" && typeof y !== "string") {
      return `(${this.parseCondition(x)}) ${op} (${this.parseCondition(y)})`;
    }

    if (typeof x !== "string" && typeof y === "string") {
      return `(${this.parseCondition(x)}) ${op} ${y}`;
    }

    if (typeof y !== "string" && typeof x === "string") {
      return `${x} ${op} (${this.parseCondition(y)})`;
    }

    return `${x} ${op} ${y}`.trim();
  }
}
