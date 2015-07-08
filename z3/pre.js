var fileName = "problem.smt2";

var Module = {
  arguments : ["-smt2", fileName],
  noInitialRun : true,
  noExitRuntime : true,
  TOTAL_MEMORY : 128 * 1024 * 1024
};

