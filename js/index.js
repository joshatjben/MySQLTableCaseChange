(function(){
    
    // Convert takes the sql text from mysqldump, and a toUppercase boolean value.
	// If toUpperCase is set to false then names will be converted to lower case.
    function convert(sql, toUpperCase) {
		
		// Make sure toUpperCase is a boolean. If it's not default to false.
		toUpperCase = (toUpperCase === true ||  toUpperCase === false) ? toUpperCase : false;
		
		// RegExp to Match the 'create' statment to get table names
		var matchCreateTable = new RegExp("create\\s+table\\s+`[^`]+`", "gi"),
		
		// Store matches for the create statments
			matchesForCreate = sql.match(matchCreateTable),
		
		// RegExp to Match the table names
			matchTableName = new RegExp("`[^`]+`"),
		
		// This will hold a map from the old names to the new tableNames
			nameMap = {},
		
		// RegExp to match the current name.
			matchToReplace = null,
		
		// RegExp to match drop statements.  Seemed useful to me to drop the new case, and 
			matchDropToDup = null,
		
		// Output string
			outStr = sql,
			
		// _These are used in the for loop_
			curStr = "",
			curIndex = 0,
			curTableName = "",
			newName ="";
			
		//Loop through all create statments to pull out the table names
		for(; curIndex < matchesForCreate.length; curIndex+=1 ){
			
			// Set the current create stament
			curStr = matchesForCreate[curIndex];
			
			//Set the current table name
			curTableName = curStr.match(matchTableName)[0];
			
			//Set the new table name.
			newName = curTableName.replace('`', '')[toUpperCase ? "toUpperCase" : "toLowercase"]();
			
			//Create a mapping of all changed names.
			nameMap[curTableName] = newName;
			
			// Replace original table name with new tablename
			matchToReplace = new RegExp(curTableName, "gi");
			outStr = outStr.replace(matchToReplace, newName);
			
			// Drop both the new name, and the originalName
			matchDropToDup = new RegExp ("(DROP\\s+TABLE[^`]+`" + newName + "+`\\s*;)", "gi");
			debugger;
			outStr = outStr.replace(matchDropToDup, "\1\n" + "DROP TABLE IF EXISTS `" + curTableName + "`;");
		}
		
		debugger;
		
		return outStr;
    }
        
    // DOM LOAD
    // ----------
    $(function(){
        var $io = $('#io'),
            $convertbutton = $('#convertButton');
        
        //Handle convert button clicked
        $convertbutton.bind('click', function(e){
			$io.val(convert($io.val(), true));
			return false;
        });
    });
    
}());