#!/bin/bash

echo " ----------------------------------------------"
echo " ---------  AWS Spot Price Adapter ------------"
echo " ----------------------------------------------"

rm -f /tmp/namedPipe
mkfifo --mode=0666 /tmp/namedPipe

tail -f /tmp/namedPipe |  muon --name awsspotpriceadapter event & 

while [ true ]
do
  aws ec2 describe-spot-price-history --start-time $(date -u +"%Y%m%dT%H0000") --product "Linux/UNIX" --instance-type "m3.medium" --region eu-west-1 | jq -c "." | awk '{ printf( "{ \"stream-name\":\"aws-spot-price\",\"payload\":%s }\n", $1 ); }'  > /tmp/namedPipe
  sleep 5
done
