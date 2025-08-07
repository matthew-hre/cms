{
  mkShell,
  alejandra,
  bash,
  nodejs,
  pnpm,
}:
mkShell rec {
  name = "@matthew-hre/cms";

  packages = [
    bash
    nodejs
    pnpm

    # Required for CI for format checking.
    alejandra
  ];
}
