<template>
  <div class="compute-page">
    <v-container>
    <div class="display">
      <div id="form">
        <h2> Welcome to Training Zone </h2>
        <p> Calculate the amount of recommended activity for you <p>
        <form id="compute">
          <input type="text" placeholder="Name" id="name"/>
          <input type="number" placeholder="Age" id="age"/>
        <button type="button" v-on:click="submitFunction(); ">Calculate</button>
        </form>
      </div>
      <button type="button">Do it again</button>
    </div>
    </v-container>
  </div>
</template>


<script>
    export default {
        data () {
            return {
                submitFunction: function (){
                var name = document.getElementById("name").value;
                var age = document.getElementById("age").value;
                this.checkAge(age, name);
            },
                checkAge: function (age, name){
                if(age<12 || age>100){
                    window.alert("Invalid Age! Enter age between 12 and 100!");
                }else{
                    this.compute(age, name);
                }
            },
                compute: function (age, name){
                var lowRange = (72*(220 - age))/100
                var highRange = (87*(220 - age))/100

                document.getElementById("compute").style.display="none";
                var result = "Your training zone ranges from " + lowRange +" to "+ highRange + ". " +"<br><br>" + "Thank you " + name + " for computing your result with us!";
                document.getElementById("form").innerHTML = result;

                document.getElementById("reset").style.display="block";
                },
                resetButton: function (){
                    location.reload()


                }
            }
        }
    }
</script>


<style>

  .compute-page {
    width: 360px;
    padding: 8% 0 0;
    margin: auto;
  }
  .display{
    position: relative;
    z-index: 1;
    background: #FFFFFF;
    max-width: 360px;
    margin: 0 auto 100px;
    padding: 45px;
    text-align: center;
    box-shadow: 0 0 0 0 rgba(0, 0, 0, 0), 0 0 0 0 rgba(0, 0, 0, 0);
  }

  .display p{
    padding-bottom: 5px;
  }

  #form input {
    font-family: "Roboto light", sans-serif;
    outline: 0;
    background: #f2f2f2;
    width: 100%;
    border: 0;
    margin: 0 0 15px;
    padding: 15px;
    box-sizing: border-box;
    font-size: 14px;
  }
  .compute-page button {
    font-family: "Roboto light", sans-serif;
    text-transform: uppercase;
    outline: 0;
    background: #000000;
    width: 100%;
    border: 0;
    padding: 15px;
    color: #FFFFFF;
    font-size: 14px;
     -webkit-transition: all 0.3 ease;
    transition: all 0.3 ease;
    cursor: pointer;
  }
  .compute-page button:hover,.compute-page button:active,.compute-page button:focus {
    font-family: "Roboto light", sans-serif;
    text-transform: uppercase;
    outline: 0;
    background: #625E5E;
  }

  body {
    background: #5584C9;
    background: -webkit-linear-gradient(right, #5584C9, #8DC26F);
    background: -moz-linear-gradient(right, #5584C9, #8DC26F);
    background: -o-linear-gradient(right, #5584C9, #8DC26F);
    background: linear-gradient(to left, #5584C9, #8DC26F);
    font-family: "Roboto light", sans-serif;
     -webkit-font-smoothing: antialiased;
     -moz-osx-font-smoothing: grayscale;
  }

  #reset{
    margin-top: 20px;
    display:none;
  }
</style>