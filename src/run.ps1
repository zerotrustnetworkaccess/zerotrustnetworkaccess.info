Push-Location $PSScriptRoot

try
{
    docker build -t ztna-microsite .

    if ($LASTEXITCODE -ne 0)
    {
        throw "docker build failed - not starting the previous image."
    }

    docker run --rm -p 4000:4000 ztna-microsite
}
finally
{
    Pop-Location
}
