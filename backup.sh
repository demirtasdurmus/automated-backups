#!/bin/bash

PGPASSWORD=${1} pg_dump -h ${2} -U ${3} -p ${4} -Fc -d ${5} > ${6}