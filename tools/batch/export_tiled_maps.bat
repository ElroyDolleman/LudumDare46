SET root=%~dp0..\..
SET sourceFolder=%root%\assets_source\levels\maps
SET outputFolder=%root%\assets_source\levels\maps\export

FOR %%I IN (%sourceFolder%\*.*) DO (
    Tiled --export-map %%I %outputFolder%\%%~nI.json
)