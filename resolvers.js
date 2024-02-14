const Employee = require('./models/Employee');
const User = require('./models/Users');
const bcrypt = require('bcrypt');

const resolver = {

    Query:{

        getEmployees: async (parent, args) => {
            return Employee.find({});
        },

        getEmployee: async (parent, args) => {
            return Employee.findById(args.id);
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
            const user = new User({
                username: args.username,
                email: args.email,
                password: args.password
            });

            return user.save();
        },

        addEmployee: async (parent, args) => {
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
                console.error("Error adding employee:", error);
                throw new Error("Failed to add employee");
            }
        },


        updateEmployee: async (parent, args) => {
            console.log(args);
            if (!args.id) {
                return JSON.stringify({status: false, message: 'No Id Found'});
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

module.exports = resolver;