cp $1 $1.backup
cat $1 | sed $'s,\. ,.\\\n,g' | sed $'s,“,"\`,g' | sed $'s,”,\`",g' > $1.processed
