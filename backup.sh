TIMESTAMP=$(date +%s)
OUTFILE="$TIMESTAMP.backup.tar.gz"
tar -czf $OUTFILE data
aws s3 cp $OUTFILE s3://opentezos/genesis/ 
rm $OUTFILE
