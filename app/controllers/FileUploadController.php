<?php

class FileUploadController extends BaseController {

	public function imgUpload(){
		$destinationPath = 'public/Figures';
		$file = Input::file('file');
		$type = Input::get('type');
		$extension = Input::file('file')->getClientOriginalExtension();
                //extension to check if specefic file type is allowed
		$fileName = Session::get('currentqid').'_'.$type.'_'.'1'.'.'.$extension;
		$upload_success = Input::file('file')->move($destinationPath, $fileName);
		if($upload_success){
			$question = Question::find(Session::get('currentqid'));
			if($type == 'qbody'){
				$question->qbodyimgname = $fileName;
				$question->save();
			}
			if($type == 'aopt'){
				$question->aoptionimgname = $fileName;
				$question->save();
			}
			if($type == 'bopt'){
				$question->boptionimgname = $fileName;
				$question->save();
			}
			if($type == 'copt'){
				$question->coptionimgname = $fileName;
				$question->save();
			}
			if($type == 'dopt'){
				$question->doptionimgname = $fileName;
				$question->save();
			}
			if($type == 'sol'){
				$question->solutionimgname = $fileName;
				$question->save();
			}
			return Response::json($fileName);
		}else{
			return Response::json('error', 400);
		}
	}
}

