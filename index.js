var block_class_main = "spin-highlight-block";
var line_class_main = "spin-highlight-line";
var line_class_none = "spin-highlight-line-none";

var block_classes = {
    "con" : "spin-highlight-block-con",
    "var" : "spin-highlight-block-var",
    "pri" : "spin-highlight-block-pri",
    "pub" : "spin-highlight-block-pub",
    "dat" : "spin-highlight-block-dat",
    "obj" : "spin-highlight-block-obj"
}

var line_classes = {
    "+++" : "spin-highlight-line-add",
    "---" : "spin-highlight-line-remove",
    "***" : "spin-highlight-line-edit",
}

module.exports = {
    blocks: {
        code: function(block) {

            // stores the line that may be highlighted
            var highlighted_block = '';
            var currentblock = "con";

            if (block.kwargs.language) {
                currentblock = block.kwargs.language.toLowerCase();
            }


            try {

                // The process can fail (failed to parse)
                highlighted_block = "";
                strs = block.body.split("\n");

                for (var i = 0; i < strs.length; i++) {

                    var edit_block = line_class_none;

                    // check if edit features exist
                    for (var property in line_classes) {

                        mark_len = property.length;

                        if (strs[i].length >= mark_len && strs[i].substring(0, mark_len) == property) {
                            edit_block = line_classes[property];
                            strs[i] = strs[i].substring(mark_len);
                            break;
                        }
                    }

                    // check if spin blocks present
                    for (var property in block_classes) {

                        mark_len = property.length;

                        if (strs[i].length >= mark_len && strs[i].toUpperCase().substring(0, mark_len) === property.toUpperCase()) {
                            currentblock = property;
                            break;
                        }
                    }

                    if (strs[i].length == 0) {
                        strs[i] = ' ';
                    }

                    highlighted_block += '<span class="' + block_class_main + ' ' + block_classes[currentblock];
                    
                    if (edit_block !== line_class_none)
                    {
                        highlighted_block += ' ' + line_class_main;
                    }

                    highlighted_block += ' ' + edit_block;
                        
                    highlighted_block += '">';
                    highlighted_block += strs[i];
                    highlighted_block += "</span>";

                    if (i < strs.length-1) {
                        highlighted_block += "\n";
                    }
                }

            } catch(e) {

                console.warn('Failed to highlight:');
                console.warn(e);
                highlighted_block = block.body;

            }

            return highlighted_block;
        }
    }
};
