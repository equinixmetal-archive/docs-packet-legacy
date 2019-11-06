#!/bin/bash

all_directories () {
    for item in "$1"/*
    do
        if [[ -d $item ]]; then
            # echo "$item is a directory"
            all_directories "$item"
        fi
    done

    # my_file="$1/"
    # [ -e $my_file ] && rm $my_file # check if the file exists and delete it

    for item in "$1"/*
    do
        if [ -f $item ]
        then 
            if [ ! -s $item ] # if the file doesn't have a size greater than zero
            then 
                echo "Content coming soon..." >> $item
                # echo $item
            fi
        # else
        #     echo "Content coming soon..." >> $my_file
        fi
    done
}

all_directories "."