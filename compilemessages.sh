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
po_file="mopidy_musicbox_darkclient/${locale_dir}/${domain}.po"
mo_file="mopidy_musicbox_darkclient/${locale_dir}/${domain}.mo"
# create .mo file from .po
msgfmt ${po_file} --output-file=${mo_file}

po2json mopidy_musicbox_darkclient/locale mopidy_musicbox_darkclient/static/locale messages
