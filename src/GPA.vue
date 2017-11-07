<template>
  <div id="app">
    <div class="compute-page">
      <div class="display">
        <div id="form">
          <h2> Calculate Your GPA</h2>
          <p> This awesome program helps you calculate your average GPA. Enter your grades below.
            <p>
              <form id="compute">
                <div class="row">
                  <p> Course 1: </p>
                  <select v-model="course1Grade">
        	  <option selected disabled>Select Grade</option>
              <option value="4.0">A</option>
              <option value="3.7">A-</option>
              <option value="3.3">B+</option>
              <option value="3.0">B</option>
              <option value="2.7">B-</option>
              <option value="2.3">C+</option>
              <option value="2.0">C</option>
              <option value="2.7">C-</option>
              <option value="2.3">D+</option>
              <option value="1.0">D</option>
              <option value="0.0">F</option>
            </select>

                  <select v-model="CreditHours1">
  				<option selected disabled>Select Credit Hours</option>
    			<option value="0" selected>0.0</option>
    			<option value="1">1.0</option>
    			<option value="2">2.0</option>
   				<option value="3">3.0</option>
   				<option value="4">4.0</option>
  			</select>

                </div>
                <div class="row">
                  <p> Course 2: </p>
                  <select v-model="course2Grade">
        	  <option selected disabled>Select Grade</option>
              <option value="4.0">A</option>
              <option value="3.7">A-</option>
              <option value="3.3">B+</option>
              <option value="3.0">B</option>
              <option value="2.7">B-</option>
              <option value="2.3">C+</option>
              <option value="2.0">C</option>
              <option value="2.7">C--</option>
              <option value="2.3">D+</option>
              <option value="1.0">D</option>
              <option value="0.0">F</option>
            </select>

                  <select v-model="CreditHours2">
  				<option selected disabled>Select Credit Hours</option>
    			<option value="0" selected>0.0</option>
    			<option value="1">1.0</option>
    			<option value="2">2.0</option>
   				<option value="3">3.0</option>
   				<option value="4">4.0</option>
  			</select>
                </div>
                <div class="row">
                  <p> Course 3: </p>
                  <select v-model="course3Grade">
        	  <option selected disabled>Select Grade</option>
              <option value="4.0">A</option>
              <option value="3.7">A-</option>
              <option value="3.3">B+</option>
              <option value="3.0">B</option>
              <option value="2.7">B-</option>
              <option value="2.3">C+</option>
              <option value="2.0">C</option>
              <option value="2.7">C--</option>
              <option value="2.3">D+</option>
              <option value="1.0">D</option>
              <option value="0.0">F</option>
            </select>

                  <select v-model="CreditHours3">
  				<option selected disabled>Select Credit Hours</option>
    			<option value="0" selected>0.0</option>
    			<option value="1">1.0</option>
    			<option value="2">2.0</option>
   				<option value="3">3.0</option>
   				<option value="4">4.0</option>
  			</select>
                </div>
                <div class="row">
                  <p> Course 4: </p>
                  <select v-model="course4Grade">
        	  <option selected disabled>Select Grade</option>
              <option value="4.0">A</option>
              <option value="3.7">A-</option>
              <option value="3.3">B+</option>
              <option value="3.0">B</option>
              <option value="2.7">B-</option>
              <option value="2.3">C+</option>
              <option value="2.0">C</option>
              <option value="2.7">C--</option>
              <option value="2.3">D+</option>
              <option value="1.0">D</option>
              <option value="0.0">F</option>
            </select>
                  <select v-model="CreditHours4">
  				<option selected disabled>Select Credit Hours</option>
    			<option value="0" selected>0.0</option>
    			<option value="1">1.0</option>
    			<option value="2">2.0</option>
   				<option value="3">3.0</option>
   				<option value="4">4.0</option>
  			</select>
                </div>
                <button type="button" v-on:click="calculate(); visible = !visible">Calculate</button>
              </form>
        </div>
        <h4 v-if = "visible">
            Your GPA is {{average}}
        </h4>
    </div>
  </div>
    </div>
</template>

<script>
    export default {
        data () {
            return {
                course1Grade: "Select Grade",
                course2Grade: "Select Grade",
                course3Grade: "Select Grade",
                course4Grade: "Select Grade",
                CreditHours1: "Select Credit Hours",
                CreditHours2: "Select Credit Hours",
                CreditHours3: "Select Credit Hours",
                CreditHours4: "Select Credit Hours",
                average: 0,
                visible: false,
                calculate: function() {
                    this.grade1 = Number(this.course1Grade) * Number(this.CreditHours1);
                    this.grade2 = Number(this.course2Grade) * Number(this.CreditHours2);
                    this.grade3 = Number(this.course3Grade) * Number(this.CreditHours3);
                    this.grade4 = Number(this.course4Grade) * Number(this.CreditHours4);
                    this.average = this.grade1 + this.grade2 + this.grade3 + this.grade4;
                    this.average = this.average / (Number(this.CreditHours1) + Number(this.CreditHours2) + Number(this.CreditHours3) + Number(this.CreditHours4));
                    Math.round(this.average=this.average.toFixed(2))
                }
            }
        }
    }
</script>
