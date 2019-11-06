#!/bin/bash

all_directories () {
    for item in "$1"/*
    do
        if [[ -d $item ]]; then
            # echo "$item is a directory"
            all_directories "$item"
        fi
    done

    my_file="$1/01-overview.md"
    # [ -e $my_file ] && rm $my_file # check if the file exists and delete it

    if [ -f $my_file ]
    then 
        if [ ! -s $my_file ] # if the file doesn't have a size greater than zero
        then 
            echo "Content coming soon..." >> $my_file
        fi
    else
        echo "Content coming soon..." >> $my_file
    fi
}

all_directories "."