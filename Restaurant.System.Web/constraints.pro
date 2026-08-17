gen_enforced_dependency(WorkspaceCwd, DependencyName, DependencyVersion, DependencyType) :-
  workspace_has_dependency(WorkspaceCwd, DependencyName, DependencyVersion, DependencyType),
  workspace_has_dependency(_, DependencyName, OtherVersion, _),
  DependencyVersion \= OtherVersion.
