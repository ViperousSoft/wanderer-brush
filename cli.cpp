#include<cstdio>
#include<string>
#include<iostream>
using namespace std;
int main(int argc,char* argv[]){
	string cmd="start worker.exe gK";
	char tmp[100];
	int c=1;
	if(argc>=2)sscanf(argv[1],"%d",&c);
	if(argc>=3){
		sscanf(argv[2],"%s",tmp);
		cmd+=" ";
		cmd+=string(tmp);
	}
	if(argc>=4){
		sscanf(argv[3],"%s",tmp);
		cmd+=" ";
		cmd+=string(tmp);
	}
	for(int i=0;i<c;i++){
		system(cmd.data());
	}
	return 0;
}
