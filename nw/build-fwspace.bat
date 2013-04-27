rem;; TODO: zip the hostspirit folder automatically and rename it to nw file!!

copy /b nw.exe+..\fwspace\fwspace.nw fwspace.exe
del ..\fwspace\fwspace.nw

rem;; zip the file release.zip
rem;; add C:\Program Files\WinRAR to the PATH variable of system environment
winrar a -afzip release.zip fwspace.exe ffmpegsumo.dll icudt.dll libEGL.dll libGLESv2.dll nw.pak

rem;; remove the zip file to the hostspirit folder

move release.zip ..\fwspace\

pause