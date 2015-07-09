#include <rhea/simplex_solver.hpp>
#include <rhea/variable.hpp>
#include <rhea/iostream.hpp>
#include <emscripten/bind.h>

#include <string>

using namespace emscripten;

rhea::linear_expression createExpressionVarVar(rhea::variable v1, std::string op, rhea::variable v2) {
  if (op == "+") {
    return rhea::linear_expression(v1 + v2);
  } else {
    return rhea::linear_expression(v1 - v2);
  }
}

rhea::linear_expression createExpressionVarConst(rhea::variable v1, std::string op, double v2) {
  if (op == "+") {
    return rhea::linear_expression(v1 + v2);
  } else if (op == "-") {
    return rhea::linear_expression(v1 - v2);
  } else if (op == "*") {
    return rhea::linear_expression(v1 * v2);
  } else {
    return rhea::linear_expression(v1 / v2);
  }
}

rhea::linear_expression createExpressionConstVar(double v1, std::string op, rhea::variable v2) {
  if (op == "+") {
    return rhea::linear_expression(v1 + v2);
  } else if (op == "-") {
    return rhea::linear_expression(v1 - v2);
  } else {
    return rhea::linear_expression(v1 * v2);
  }
}

rhea::linear_equation createEquationExpVar(rhea::linear_expression e1, rhea::variable v2) {
  return rhea::linear_equation(e1 == v2);
}
rhea::linear_equation createEquationExpExp(rhea::linear_expression e1, rhea::linear_expression e2) {
  return rhea::linear_equation(e1 == e2);
}
rhea::linear_equation createEquationVarExp(rhea::variable e1, rhea::linear_expression e2) {
  return rhea::linear_equation(e1 == e2);
}
rhea::linear_equation createEquationVarVar(rhea::variable v1, rhea::variable v2) {
  return rhea::linear_equation(v1 == v2);
}
rhea::linear_equation createEquationVarConst(rhea::variable v1, double e2) {
  return rhea::linear_equation(v1 == e2);
}

rhea::linear_inequality createInequalityExpExp(rhea::linear_expression e1, std::string op, rhea::linear_expression e2) {
  return op == "<=" ? e1 <= e2 : e1 >= e2;
}
rhea::linear_inequality createInequalityVarExp(rhea::variable e1, std::string op, rhea::linear_expression e2) {
  return op == "<=" ? e1 <= e2 : e1 >= e2;
}
rhea::linear_inequality createInequalityVarVar(rhea::variable e1, std::string op, rhea::variable e2) {
  return op == "<=" ? e1 <= e2 : e1 >= e2;
}
rhea::linear_inequality createInequalityVarConst(rhea::variable e1, std::string op, double e2) {
  return op == "<=" ? e1 <= e2 : e1 >= e2;
}

rhea::constraint createConstraintEq(rhea::linear_equation eq1) {
  return rhea::constraint(eq1);
}
rhea::constraint createConstraintIneq(rhea::linear_inequality eq1) {
  return rhea::constraint(eq1);
}

bool constraintIsSatisfied(rhea::constraint c) {
  return c.is_satisfied();
}
bool equationIsSatisfied(rhea::linear_equation c) {
  return c.is_satisfied();
}
bool inequalityIsSatisfied(rhea::linear_inequality c) {
  return c.is_satisfied();
}

void solverAddConstraint(rhea::simplex_solver s, rhea::constraint c) {
  s.add_constraint(c);
}
void solverSuggest(rhea::simplex_solver s, rhea::variable v1, double x) {
  s.suggest(v1, x);
}
void solverSolve(rhea::simplex_solver s) {
  s.solve();
}



std::vector<double> test() {
  rhea::variable v1, v2;
  rhea::simplex_solver solver;
  
  // v1 - 1 == v2
  rhea::linear_expression e1 = createExpressionVarConst(v1, "-", 1);
  rhea::linear_equation eq1 = createEquationExpVar(e1, v2);
  rhea::constraint c1 = createConstraintEq(eq1);
  
  // v1 >= 2
  rhea::linear_inequality eq2 = createInequalityVarConst(v1, ">=", 2);
  rhea::constraint c2 = createConstraintIneq(eq2);

  solverAddConstraint(solver, c1);
  solverAddConstraint(solver, c2);
  solverSolve(solver);

  // solver.add_constraints({
  //   v1 - 1 == v2,
  //   v1 >= 2
  // });
  // solver.solve();

  return std::vector<double> { v1.value(), v2.value() };
}


EMSCRIPTEN_BINDINGS(my_module)
{
  register_vector<double>("VectorDouble");
  function("test", &test);

  function("createExpressionVarVar", &createExpressionVarVar);
  function("createExpressionVarConst", &createExpressionVarConst);
  function("createExpressionConstVar", &createExpressionConstVar);

  function("createEquationExpVar", &createEquationExpVar);
  function("createEquationExpExp", &createEquationExpExp);
  function("createEquationVarExp", &createEquationVarExp);
  function("createEquationVarVar", &createEquationVarVar);
  function("createEquationVarConst", &createEquationVarConst);

  function("createInequalityExpExp", &createInequalityExpExp);
  function("createInequalityVarExp", &createInequalityVarExp);
  function("createInequalityVarVar", &createInequalityVarVar);
  function("createInequalityVarConst", &createInequalityVarConst);

  function("createConstraintEq", &createConstraintEq);
  function("createConstraintIneq", &createConstraintIneq);

  function("solverAddConstraint", &solverAddConstraint);
  function("solverSuggest", &solverSuggest);
  function("solverSolve", &solverSolve);

  class_<rhea::variable>("Variable")
    .constructor<>()
    .constructor<double>()
    .function("value", &rhea::variable::value)
    .function("set_value", &rhea::variable::set_value)
    ;

  class_<rhea::constraint>("Constraint")
    .function("is_satisfied", &constraintIsSatisfied)
    ;

  class_<rhea::linear_expression>("LinearExpression")
    .function("evaluate", &rhea::linear_expression::evaluate)
    ;

  class_<rhea::linear_equation>("LinearEquation")
    .function("is_satisfied", &equationIsSatisfied)
    ;
  class_<rhea::linear_inequality>("LinearInequality")
    .function("is_satisfied", &inequalityIsSatisfied)
    ;

  class_<rhea::simplex_solver>("SimplexSolver")
    .constructor<>()
    .function("add_constraint", &solverAddConstraint)
    .function("suggest", &solverSuggest)
    .function("solve", &solverSolve)
    ;
}


