CC=pdflatex
BIB=biber

SRC=$(wildcard *.tex)
OBJ=$(SRC:.tex=)
all: pdf

pdf: ${SRC}
	${CC} ${OBJ}
	#biber ${OBJ}
	${CC} ${OBJ}
	latex_count=8 ; \
	while egrep -s 'Rerun (LaTeX|to get cross-references right)' ${OBJ}.log && [ $$latex_count -gt 0 ] ;\
	    do \
	      echo "Rerunning latex...." ;\
	      ${CC} ${OBJ} ;\
	      latex_count=`expr $$latex_count - 1` ;\
	    done

clean: 
	rm -f *.ps *.dvi *.aux *.toc *.idx *.ind *.ilg *.log *.out *.brf *.blg *.bbl ${OBJ} *.bcf *.fls *.run.xml *.fdb_latexmk *~ *.nav *.snm
