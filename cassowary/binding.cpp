#include <rhea/simplex_solver.hpp>
#include <rhea/iostream.hpp>
#include <emscripten/bind.h>

using namespace emscripten;

double test(double a) {
  rhea::variable left, mid, right;
  rhea::simplex_solver solver;

  solver.add_constraints(
  {
    mid == (left + right) / 2,
    right == left + 10,
    right <= a,
    left >= 0
  });
  solver.suggest(mid, 2);

  return right.value();
}

EMSCRIPTEN_BINDINGS(my_module)
{
  function("test", &test);
}