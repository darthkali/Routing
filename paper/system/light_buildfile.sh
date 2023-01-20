# --- User-Input ---

# 0 Debug-Mode = Off -> Terminal doesn't close after the build process was finished
# 1 Debug-Mode = ON -> Terminal close directly after the build process was finished
DEBUG=0

# --- Setup ---
BASEDIR=$(dirname "$0")
BASEDIR=${BASEDIR%system*}
OUT_DIR=$BASEDIR/out

# --- Start Command ---
echo "########################################"
echo "#########    Start Build    ############"
echo "########################################"
echo ""

#change the directory - go into the root-folder
cd "$BASEDIR" || exit

# Second Latex Build with the latexmk compiler
latexmk -pdf -file-line-error -interaction=nonstopmode -synctex=1 -output-format=pdf -output-directory="$OUT_DIR" -aux-directory="$OUT_DIR" thesis.tex

#TODO  open PDF
#cd out || exit
#xdg-open "$BASEDIR\out\thesis.pdf"

# exit only with key pressed or after 5 Minutes
echo ""
echo ""
if [ $DEBUG = 1 ]; then
  echo "Press any key to continue"
  while true; do
    read -t 1 -n 1 -r
    if [ $? = 0 ]; then
      exit
    fi
  done
fi
