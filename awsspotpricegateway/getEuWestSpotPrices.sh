#!/bin/bash

aws ec2 describe-spot-price-history --start-time $(date -u +"%Y%m%dT%H0000") --product "Linux/UNIX" --instance-type "m3.medium" --region eu-west-1

