rem;; TODO: zip the hostspirit folder automatically and rename it to nw file!!

copy /b nw.exe+hostspirit.nw hostspirit.exe
del hostspirit.nw

rem;; zip the file release.zip
rem;; add C:\Program Files\WinRAR to the PATH variable of system environment
winrar a -afzip release.zip hostspirit.exe ffmpegsumo.dll icudt.dll libEGL.dll libGLESv2.dll nw.pak

rem;; remove the zip file to the hostspirit folder

move release.zip ..\hostspirit\

pause