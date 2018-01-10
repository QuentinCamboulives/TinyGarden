$(document).ready(function(){

    // ---------- LEDS ----------

    //Focus de l'input lié à la led lors d' un clic sur le svg
    $(".led").on('click', function() {

        console.log($(this).attr('class').substring(4));
        $("." + $(this).attr('class').substring(4) + "input").focus();

    });




    $(".ledInput").on("focus", function() {
        var value = $(this).val();
        $("." + $(this).attr("led")).attr("fill", value);
    });




    /*
$(".ledInput").on('input', function () {
    console.log($(this).val());
    $("#led1").attr("fill", $(this).val());
});

$("#led1input").on('input', function () {
    console.log($(this).val());
    $("#led2input").val($(this).val());
});
*/

});