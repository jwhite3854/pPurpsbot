const Discord = require('discord.io');

// Initialize Discord Bot
const client = new Discord.Client();

client.on('message', function (user, userID, channelID, message, evt) {
    if (message.substring(0, 1) == '/') {
        var input_string = message.toLowerCase().trim();
        var args = input_string.substring(1).split(' ');
        var cmd = args[0];
       
        args = args.splice(1);
        switch(cmd) {

            case 'roll':
                output = '';

                if ( args.length > 0 ) {
                    var dice_regex = /^\d+d\d+$/;
                    var dice_input = args.shift();
                    var isRollCorrect = dice_input.match(dice_regex); 

                    if ( isRollCorrect ) {
                        var rolls = dice_input.split('d');
                        var targetNumber = 0;
                        var botchTolerance = 0;

                        if ( args.length > 0 ) {
                            args.forEach(function(arg){
                                mod = arg.substring(1);
                                if ( arg.substring(0,1) == 'v' ) {
                                    targetNumber = parseInt(mod);
                                } else if (arg.substring(0,1) == 'b' ) {
                                    botchTolerance = parseInt(mod);
                                }
                            });
                        }

                        var results = [];
                        var successes = 0;
                        var botches = 0;
                        for ( i = 0; i < rolls[0]; i++ ) {
                            var roll_result = Math.floor(Math.random() * rolls[1]) + 1
                            results.push(roll_result);
                            if ( roll_result == 1 ) {
                                botches++;
                            }
                            if ( roll_result >= targetNumber ) {
                                successes++;
                            }
                        }

                        while ( botches > 0 ) {
                            if ( botchTolerance < 1 ) {
                                successes--;
                            }
                            botchTolerance--;
                            botches--;
                        }

                        if ( targetNumber > 0 ) {
                            if ( successes > 0 ) {
                                output = '**' + successes + ' Success'+ ( successes > 1 ? 'es' : '' ) +'** - ';
                            } else if ( successes < 0 ) {
                                output = '**Critical Failure** - ';
                            } else {
                                output = '**Failure** - ';
                            }
                        }

                        output += ' **'+user+'** Rolled: [' + results.join(', ') + ']';
                    } else {
                        output = 'PURPSbot Error: Your roll syntax is not XdY';
                    }
                } else {
                    output = 'PURPSbot Error: Do you need help with syntax? Try "/rollhelp';
                }
            break;
            case 'rollsave':
                output = '';

                var roll = Math.floor(Math.random() * 10) + 1;
                var result = '';

                if ( args.length > 0 ) {
                    var save_mod = args.shift();
                    result = ' **Result: ' + ( roll + parseInt(save_mod) ) + '** |';
                } 

                output += ' **'+user+'**' + result + ' Rolled: ' + roll;
            break;
            case 'rollhelp':
                output = '~ **/roll XdY vZ bN** Standard skill roll, where X is number of dice, Y is d-type. Optional: Z (target number),  N (botch tolerance)';
                output +=  "\n" + '~ **/rollsave X** Saving roll, where X is an optional Save mod.';
                break;
         }
         bot.sendMessage({
            to: channelID,
            message: output
        });
    } else if ( message === 'gnight purpsbot' ) {
        var moutput = 'Goodnight,  **'+user+'**';
        bot.sendMessage({
            to: channelID,
            message: moutput
        });
    }
});

client.login(process.env.BOT_TOKEN);//BOT_TOK