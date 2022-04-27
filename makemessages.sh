#!/bin/bash 
# get arguments and init variables
if [ "$#" -lt 1 ]; then
    echo "Usage: $0 <locale> [optional: <domain_name>]"
    exit 1
fi
locale=$1
domain="messages"
if [ ! -z "$2" ]; then
    domain=$2
fi
locale_dir="mopidy_musicbox_darkclient/locale/${locale}/LC_MESSAGES"
pot_file="mopidy_musicbox_darkclient/locale/${domain}.pot"
po_file="${locale_dir}/${domain}.po"
# create folders if not exists
mkdir -p $locale_dir
# create .pot file

cat mopidy_musicbox_darkclient/static/index.html | sed 's/% end %/% endif %/g' > mopidy_musicbox_darkclient/static/index_fix.html
/usr/local/bin/pybabel extract --keywords t -F babel.cfg -o ${pot_file}  --input=mopidy_musicbox_darkclient/static/
rm -f mopidy_musicbox_darkclient/static/index_fix.html

# init .po file, if it doesn't exist yet
if [ ! -f $po_file ]; then
    msginit --input=${pot_file} --output-file=${po_file} --no-wrap --locale=${locale}
else
    # update .po file
    msgmerge --no-wrap --sort-by-file --output-file=${po_file} ${po_file} ${pot_file}
fi
