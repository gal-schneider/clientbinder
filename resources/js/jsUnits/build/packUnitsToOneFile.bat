echo off

echo backup jsUnit.js
move jsUnits.js backup
cd backup
set datetimef=%DATE:~10,4%%DATE:~4,2%%DATE:~7,2%__%time:~0,2%_%time:~3,2%_%time:~6,2%
SET DAY=%DATE:~10,4%%DATE:~4,2%%DATE:~7,2%
RENAME jsUnits.js jsUnits_%datetimef%.js_backup
cd ..
echo off

cd ..
for /F "tokens=*" %%A in (unitsInitiator.js) do (
    echo %%A >> %~dp0\jsUnits.js
)

cd framework

for /R /D %%s in (*) do ( 
    @echo == dir is %%s
    cd %%s
    for /R %%f in (*) do (
        @echo ==== file is %%f   
        for /F "tokens=*" %%A in (%%f) do (
            echo %%A >> %~dp0\jsUnits.js
        )
    )
)

cd %~dp0

copy jsUnits.js ..\ready\