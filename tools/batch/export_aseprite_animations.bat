SET root=%~dp0..\..
SET sourceFolder=%root%\assets_source\aseprite\animations
SET outputFolder=%root%\assets_source\images\animations

FOR /D %%G IN (%sourceFolder%\*) DO (
    FOR %%I IN (%%G\*.*) DO (
        aseprite -b %%I --save-as %outputFolder%\%%~nxG\%%~nI_00.png
    )
)

SET sourceFolder=%root%\assets_source\images\
SET outputFolder=%root%\dist\assets\

FOR /D %%G IN (%sourceFolder%\animations\*) DO (
    texturepacker %%G --format phaser --data %outputFolder%\%%~nxG.json --sheet %outputFolder%\%%~nxG.png --extrude 0 --force-squared --disable-rotation
)