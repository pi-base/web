Formula "formula" = And / Or / Atom

_ "whitespace" = [ \t\n\r]*

And = _ "(" _ head:Formula tail:(_ Conjunction _ Formula)+ _ ")" _ {
  return { and: [head].concat(tail.map((item: any[]) => item[3])) }
}

Or = _ "(" _ head:Formula tail:(_ Disjunction _ Formula)+ _ ")" _ {
  return { or: [head].concat(tail.map((item: any[]) => item[3])) }
}

Atom = mod:Modifier? _ prop:Property {
  let value;
  if (mod === '?') {
    value = undefined
  } else if (mod) {
    value = false
  } else {
    value = true
  }
  return { property: prop, value: value }
}

// /!\ Important /!\
// If you add any new important symbols, make sure that the are also removed
//   from the character set below for properties
Modifier    "modifier"      = "~" / "not " / "?"
Conjunction "conjunction"   = "++" / "+" / "&&" / "&"  // N.B. "+" / "++" breaks!
Disjunction "disjunction"   = "||" / "|"
Property    "property name" = prop:[^~+&|()]+ {
  return prop.join("").trim()
}
