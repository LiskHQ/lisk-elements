read -r -p $'\e[96mDo you want to build Lisk Elements first? [y/N]\e[0m ' should_build
if [[ $should_build =~ ^[Yy]$ ]]
then
	npm run build
fi
