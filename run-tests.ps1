Set-Location -Path (Split-Path -Parent $MyInvocation.MyCommand.Path)

$env:NODE_OPTIONS = "--experimental-vm-modules"

# Run tests (Windows-friendly)
npx jest --runInBand

