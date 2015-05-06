#include <ceres/ceres.h>
#include <emscripten/bind.h>

using ceres::AutoDiffCostFunction;
using ceres::CostFunction;
using ceres::Problem;
using ceres::Solver;
using ceres::Solve;
using ceres::LoggingType;

using namespace emscripten;

// A templated cost functor that implements the residual r = 10 -
// x. The method operator() is templated so that we can then use an
// automatic differentiation wrapper around it to generate its
// derivatives.
struct CostFunctor {
  template <typename T> bool operator()(const T* const x, T* residual) const {
    residual[0] = T(10.0) - x[0];
    return true;
  }
};

double test(double a) {
    // The variable to solve for with its initial value. It will be
  // mutated in place by the solver.
  double x = a;
  const double initial_x = x;

  // Build the problem.
  Problem problem;

  // Set up the only cost function (also known as residual). This uses
  // auto-differentiation to obtain the derivative (jacobian).
  CostFunction* cost_function =
      new AutoDiffCostFunction<CostFunctor, 1, 1>(new CostFunctor);
  problem.AddResidualBlock(cost_function, NULL, &x);

  // Run the solver!
  Solver::Options options;
  options.minimizer_progress_to_stdout = false;
  options.logging_type = LoggingType::SILENT;
  Solver::Summary summary;
  Solve(options, &problem, &summary);

  return x;
}

EMSCRIPTEN_BINDINGS(my_module)
{
  function("test", &test);
}