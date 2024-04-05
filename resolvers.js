const Employee = require('./models/employee.js');
const User = require('./models/users.js');
const bcrypt = require('bcrypt');

exports.resolvers = {

    Query:{

        getAllEmployees: async (parent, args) => {
            return Employee.find({});
        },

        getEmployee: async (parent, args) => {
            try{
                employee = await Employee.findById(args.id);
                if (!employee) {
                    return JSON.stringify({status: false, message: 'No employee found'});
                }
                return employee;
            }
            catch (error) {
                return JSON.stringify({status: false, "message" : "No ID found"});
            }
        },

        Login: async (parent, args) => {
            const { username_email, password } = args;
            console.log(args);
            const user = await User.findOne({ $or: [{ username: username_email }, { email: username_email }] });

            if (!user) {
                throw new Error('User not found');
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                throw new Error('Invalid password');
            }

            return user;
            
        },

    },

    Mutation:{

        signUp: async (parent, args) => {

            if (!args.username || !args.email || !args.password) {
                return new Error("Username, email, and password are required.");
              }

            try {
              const newUser = new User({
                username: args.username,
                email: args.email,
                password: args.password
              });
      
              console.log("we are here");
              await newUser.save();
              return newUser;
            } catch (error) {
                return new Error("Error creating user: " + error.message);
            }
          }
        ,

        addEmployee: async (parent, args) => {

            if (!args.first_name || !args.last_name || !args.salary) {
                throw new Error("First name, Last name and Salary are required");
            }

            try {
                const employee = new Employee({
                    first_name: args.first_name,
                    last_name: args.last_name,
                    email: args.email,
                    gender: args.gender,
                    salary: args.salary
                });
                const savedEmployee = await employee.save();
                return savedEmployee;
            } catch (error) {

                if (error.code === 11000) {
                    throw new Error("Employee already exists");
                }
                else if (error.name === "ValidationError") {
                    throw new Error("Invalid input");
                }
                throw new Error("Failed to add employee");
            }
        },


        updateEmployee: async (parent, args) => {
            console.log(args);
            if (!args.id) {
                return JSON.stringify({status: false, message: 'No Id Found'});
            }

            if (args.id.length !== 24) {
                return JSON.stringify({status: false, message: 'Invalid Id'});
            }
    
            try {
                const employee = await Employee.findByIdAndUpdate(
                    args.id,

                    {
                        $set: {
                            first_name: args.first_name,
                            last_name: args.last_name,
                            email: args.email,
                            gender: args.gender,
                            salary: args.salary
                        }
                    },
                    { new: true }
                );

                if (!employee) {
                    return JSON.stringify({status: false, message: 'No employee found'});
                }

                    
                return employee;
            } catch (err) {
                console.log('Something went wrong when updating the employee', err);
                return null;
            }
        },

        deleteEmployee: async (parent, args) => {
            console.log(args);
            if(!args.id){
                return JSON.stringify({status: false, message: 'No Id Found'});
            }    
            return await Employee.findByIdAndDelete(args.id)
        }

    }   
};
